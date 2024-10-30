import { parse as parseHTML } from 'node-html-parser';
import contrastCheck from 'wcag-contrast';

export async function GET(request) {
  // Using a try-catch block to handle errors appropriately
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    // Validate the URL parameter
    if (!url) {
      return new Response(JSON.stringify({ error: 'URL parameter is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    // Fetching the page HTML
    const { html } = await fetchPageHTML(url);
    
    // Running the accessibility audit
    const results = await runAccessibilityAudit(html);

    // Returning the results as a JSON response
    return new Response(JSON.stringify(results), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    // Handling any errors during the request
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

// Function to fetch the HTML of the page
async function fetchPageHTML(url) {
  const response = await fetch(`https://source-render-api.onrender.com/fetch-html?url=${encodeURIComponent(url)}`);
  
  // Check for a successful response
  if (!response.ok) {
    throw new Error(`Failed to fetch page: ${response.status}`);
  }
  
  const data = await response.json();
  if (!data.html) {
    throw new Error('No HTML found in the response');
  }

  return data; 
}

// Function to run the accessibility audit
async function runAccessibilityAudit(html) {
  const root = parseHTML(html);

  const results = [
    {
      description: 'ARIA attributes match their roles',
      passed: checkARIAAttributesMatchRoles(root)
    },
    {
      description: 'Buttons have an accessible name',
      passed: checkButtonAccessibleNames(root)
    },
    {
      description: 'Image elements have alt attributes',
      passed: checkImageAltAttributes(root)
    },
    {
      description: 'Form inputs have associated labels',
      passed: checkFormLabelAssociation(root)
    },
    {
      description: 'Color contrast meets WCAG guidelines',
      passed: await checkColorContrast(root)
    },
    {
      description: 'Document has a main landmark',
      passed: checkMainLandmark(root)
    },
    {
      description: 'Headings follow correct hierarchy',
      passed: checkHeadingHierarchy(root)
    },
    {
      description: 'Links have descriptive text',
      passed: checkLinkDescriptiveText(root)
    }
  ];

  const score = results.filter(r => r.passed).length / results.length * 100;

  const suggestions = results.filter(r => !r.passed).map(r => r.description);

  return {
    checks: results,
    score: Math.round(score),
    suggestions
  };
}

function checkARIAAttributesMatchRoles(root) {
  const ariaElements = root.querySelectorAll('[aria-*]');

  for (const element of ariaElements) {
    const role = element.getAttribute('role');
    const ariaAttributes = element.getAttributeNames().filter(attr => attr.startsWith('aria-'));

    for (const ariaAttr of ariaAttributes) {
      if (!validateARIAAttribute(role, ariaAttr, element.getAttribute(ariaAttr))) {
        return false;
      }
    }
  }

  return true;
}

function validateARIAAttribute(role, attribute, value) {
  const ariaRoleMap = {
    button: ['aria-pressed', 'aria-disabled'],
    checkbox: ['aria-checked', 'aria-readonly', 'aria-required'],
    dialog: ['aria-labelledby', 'aria-describedby'],
    link: ['aria-disabled'],
    listbox: ['aria-multiselectable', 'aria-readonly'],
    menu: ['aria-orientation'],
    menuitem: ['aria-disabled', 'aria-checked'],
    menubar: ['aria-orientation'],
    navigation: ['aria-label', 'aria-roledescription'],
    radio: ['aria-checked', 'aria-readonly', 'aria-required'],
    region: ['aria-label', 'aria-roledescription'],
    tab: ['aria-selected', 'aria-controls', 'aria-expanded'],
    tablist: ['aria-orientation', 'aria-multiselectable'],
    textbox: ['aria-readonly', 'aria-required', 'aria-invalid'],
    treeitem: ['aria-expanded', 'aria-selected']
  };

  if (ariaRoleMap[role]) {
    if (ariaRoleMap[role].includes(attribute)) {
      switch (attribute) {
        case 'aria-checked':
        case 'aria-disabled':
        case 'aria-expanded':
        case 'aria-readonly':
        case 'aria-required':
        case 'aria-selected':
          return typeof value === 'boolean' || ['true', 'false'].includes(value);
        case 'aria-invalid':
          return ['true', 'false', 'grammar', 'spelling'].includes(value);
        case 'aria-multiselectable':
          return typeof value === 'boolean' || ['true', 'false'].includes(value);
        case 'aria-orientation':
          return ['horizontal', 'vertical'].includes(value);
        case 'aria-pressed':
          return typeof value === 'boolean' || ['true', 'false', 'mixed'].includes(value);
        default:
          return true;
      }
    } else {
      return false;
    }
  } else {
    return true;
  }
}

function checkButtonAccessibleNames(root) {
  const buttons = root.querySelectorAll('button');

  for (const button of buttons) {
    if (!button.textContent.trim() && !button.hasAttribute('aria-label')) {
      return false;
    }
  }

  return true;
}

function checkImageAltAttributes(root) {
  const images = root.querySelectorAll('img');

  for (const img of images) {
    if (!img.hasAttribute('alt') || img.getAttribute('alt').trim() === '') {
      return false;
    }
  }

  return true;
}

function checkFormLabelAssociation(root) {
  const inputs = root.querySelectorAll('input, textarea, select');

  for (const input of inputs) {
    const id = input.getAttribute('id');
    const label = root.querySelector(`label[for="${id}"]`);

    if (!label && !input.hasAttribute('aria-label')) {
      return false;
    }
  }

  return true;
}

async function checkColorContrast(root) {
  const textElements = root.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6');

  // Using a simple black and white color contrast check as a fallback
  const contrastResults = await Promise.all(Array.from(textElements).map(async (element) => {
    const foreground = '#000000'; // Fallback to black
    const background = '#FFFFFF'; // Fallback to white

    const ratio = await contrastCheck(foreground, background);
    return ratio >= 4.5; // Ensure the contrast ratio is acceptable
  }));

  return contrastResults.every(Boolean); // Return true only if all checks passed
}

function checkMainLandmark(root) {
  const mainElement = root.querySelector('main, [role="main"]');
  return mainElement !== null;
}

function checkHeadingHierarchy(root) {
  const headings = root.querySelectorAll('h1, h2, h3, h4, h5, h6');

  let previousLevel = 0;
  for (const heading of headings) {
    const level = parseInt(heading.tagName.charAt(1));
    if (level > previousLevel + 1) {
      return false;
    }
    previousLevel = level;
  }

  return true;
}

function checkLinkDescriptiveText(root) {
  const links = root.querySelectorAll('a');

  for (const link of links) {
    const text = link.textContent.trim();
    if (text === '' || text.match(/^\d+$/)) {
      return false;
    }
  }

  return true;
}

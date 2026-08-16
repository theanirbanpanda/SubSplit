export const getBrandLogoUrl = (productName) => {
  if (!productName) return null;
  const name = productName.toLowerCase();
  
  const map = {
    'canva': 'canva',
    'adobe': 'adobe',
    'miro': 'miro',
    'sketch': 'sketch',
    'framer': 'framer',
    'visme': 'visme',
    'piktochart': 'piktochart',
    'frame.io': 'frameio',
    'microsoft': 'microsoft',
    'google': 'google',
    'notion': 'notion',
    'slack': 'slack',
    'zoho': 'zoho',
    'clickup': 'clickup',
    'asana': 'asana',
    'monday': 'monday',
    'evernote': 'evernote',
    'todoist': 'todoist',
    'grammarly': 'grammarly',
    'calendly': 'calendly',
    'dropbox': 'dropbox',
    'proton': 'proton',
    'box': 'box',
    'pcloud': 'pcloud',
    'sync': 'sync',
    '1password': '1password',
    'bitwarden': 'bitwarden',
    'bitdefender': 'bitdefender',
    'norton': 'norton',
    'kaspersky': 'kaspersky',
    'mcafee': 'mcafee',
    'avast': 'avast',
    'surfshark': 'surfshark',
    'github': 'github',
    'gitlab': 'gitlab',
    'jetbrains': 'jetbrains',
    'postman': 'postman',
    'browserstack': 'browserstack',
    'sentry': 'sentry',
    'jira': 'jira',
    'youtube': 'youtube',
    'spotify': 'spotify',
    'apple': 'apple',
    'netflix': 'netflix',
    'chatgpt': 'openai',
    'playstation': 'playstation',
    'udemy': 'udemy'
  };

  const key = Object.keys(map).find(k => name.includes(k));
  if (key) {
    return `https://cdn.simpleicons.org/${map[key]}`;
  }
  
  return null;
};

const fs = require('fs');
const file = 'src/features/marketplace/components/CategoryChips.jsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(
  /dispatch\(fetchMarketplaceListings\(\{ category: categoryName === 'All' \? null : categoryName \}\)\);/,
  "dispatch(fetchMarketplaceListings({ ...filters, category: categoryName === 'All' ? null : categoryName }));"
);
fs.writeFileSync(file, content);

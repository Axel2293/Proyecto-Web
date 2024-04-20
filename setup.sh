#!/bin/bash

# Print commands and their arguments as they are executed
set -x

# Setup the project
echo "Creating package.json..."
npm init -y

# Install nanoid package
echo "Installing Nanoid..."
npm install nanoid@3.0.0

# Install mongoose package
echo "Installing Mongoose..."
npm install mongoose --save

#install dotenv package
echo "Installing Dotenv..."
npm install dotenv --save

# Install nodemon as a development dependency
echo "Installing Nodemon for development..."
npm install nodemon --save-dev

# Install express
echo "Installing Express..."
npm install express

# Modify package.json to add the dev script
echo "Modifying package.json to add custom scripts..."
node -e "const fs = require('fs'); 
         let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8')); 
         pkg.scripts.dev = 'nodemon app/server.js'; 
         pkg.description = '## Credits\\r - Axel Escoto\\r - Emiliano Figueroa\\r - Jorge Figueroa'; 
         fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));"

echo "Setup complete!"

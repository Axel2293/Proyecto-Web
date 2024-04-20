@echo off

REM Set up the project
echo Creating package.json...
npm init -y

REM Install nanoid package
echo Installing Nanoid...
npm install nanoid@3.0.0

REM Install mongoose package
echo Installing Mongoose...
npm install mongoose --save

REM Install dotenv package
echo Installing Dotenv...
npm install dotenv --save

REM Install nodemon as a development dependency
echo Installing Nodemon for development...
npm install nodemon --save-dev

REM Install express
echo Installing Express...
npm install express

REM Add custom scripts and modify package.json using Node.js
echo Modifying package.json to add custom scripts...
node -e "const fs = require('fs'); let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8')); pkg.scripts.dev = 'nodemon app/server.js'; pkg.description = '## Credits\r - Axel Escoto\r - Emiliano Figueroa\r - Jorge Figueroa'; fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));"

echo Setup complete!

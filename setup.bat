@echo off

REM Set up the project
echo Creating package.json...
call npm init -y
if errorlevel 1 exit /b %errorlevel%

REM Install nanoid package
echo Installing Nanoid...
call npm install nanoid@3.0.0
if errorlevel 1 exit /b %errorlevel%

REM Install mongoose package
echo Installing Mongoose...
call npm install mongoose --save
if errorlevel 1 exit /b %errorlevel%

REM Install dotenv package
echo Installing Dotenv...
call npm install dotenv --save
if errorlevel 1 exit /b %errorlevel%

REM Install JWT package
echo Installing JWT...
call npm install jsonwebtoken
if errorlevel 1 exit /b %errorlevel%

REM Install nodemon as a development dependency
echo Installing Nodemon for development...
call npm install nodemon --save-dev
if errorlevel 1 exit /b %errorlevel%

REM Install express
echo Installing Express...
call npm install express
if errorlevel 1 exit /b %errorlevel%

REM Add custom scripts and modify package.json using Node.js
echo Modifying package.json to add custom scripts...
call node -e "const fs = require('fs'); let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8')); pkg.scripts.dev = 'nodemon app/server.js'; pkg.description = '## Credits\r - Axel Escoto\r - Emiliano Figueroa\r - Jorge Figueroa'; pkg.main = 'app/server.js'; fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));"
if errorlevel 1 exit /b %errorlevel%

echo Setup complete!

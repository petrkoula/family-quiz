@echo off
REM Acceptance Test Runner for Quick Start Quiz Feature (Windows)
REM
REM Runs the complete acceptance pipeline:
REM 1. Parse spec.md into spec.json IR (using dae_gherkin.js)
REM 2. Generate Taiko tests from IR (using generator.js)
REM 3. Execute generated tests

setlocal enabledelayedexpansion

REM Directories
set FEATURE_DIR=%~dp0
set PROJECT_ROOT=%FEATURE_DIR%..\..
set BUILD_DIR=%FEATURE_DIR%.build
set GENERATED_DIR=%BUILD_DIR%\generated
set SPEC_FILE=%FEATURE_DIR%spec.md
set IR_FILE=%BUILD_DIR%\spec.json

echo ========================================
echo Quick Start Quiz Acceptance Pipeline
echo ========================================
echo.

REM Step 1: Parse spec.md to IR
echo Step 1: Parsing spec.md to IR...
node "%PROJECT_ROOT%\dae_gherkin.js" "%SPEC_FILE%" "%IR_FILE%"

if not exist "%IR_FILE%" (
  echo Error: Failed to generate IR at %IR_FILE%
  exit /b 1
)

echo.

REM Step 2: Generate tests from IR
echo Step 2: Generating Taiko tests from IR...
node "%PROJECT_ROOT%\acceptance\generator.js" "%IR_FILE%" "%GENERATED_DIR%"

if not exist "%GENERATED_DIR%" (
  echo Error: Failed to generate tests in %GENERATED_DIR%
  exit /b 1
)

echo.

REM Step 3: Run generated tests
echo Step 3: Running generated acceptance tests...

REM Check if headed mode requested
set HEADLESS_FLAG=HEADLESS=true
if "%1"=="--headed" set HEADLESS_FLAG=HEADLESS=false
if "%1"=="--interactive" set HEADLESS_FLAG=HEADLESS=false

REM Count and run tests
set PASSED=0
set FAILED=0
set TOTAL=0

for %%f in ("%GENERATED_DIR%\*.test.js") do (
  set /a TOTAL+=1
  echo.
  echo Running: %%~nxf

  cmd /c "set %HEADLESS_FLAG% && node "%%f""

  if !errorlevel! equ 0 (
    set /a PASSED+=1
    echo [PASSED] %%~nxf
  ) else (
    set /a FAILED+=1
    echo [FAILED] %%~nxf
  )
)

REM Summary
echo.
echo ========================================
echo Test Summary
echo ========================================
echo Total:  %TOTAL% tests
echo Passed: %PASSED%
echo Failed: %FAILED%
echo.

if %FAILED% gtr 0 (
  echo Screenshots saved to: vue-app\tests\screenshots\
  exit /b 1
) else (
  echo All acceptance tests passed!
  exit /b 0
)

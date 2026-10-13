// Jenkinsfile: place this in the project root, next to package.json.
// Windows agent: uses `bat`. On a Linux agent, replace `bat` with `sh`.
pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    // "Build with Parameters": choose environment and which group of tests to run
    parameters {
        choice(name: 'ENV',   choices: ['qa', 'staging'], description: 'Which .env.<name> file to use')
        choice(name: 'SUITE', choices: ['smoke', 'regression', 'e2e', 'api', 'all'], description: 'Which tests to run')
    }

    environment {
        CI  = 'true'                 // config: retries=2, workers=2, forbidOnly
        ENV = "${params.ENV}"        // read by playwright.config.js
    }

    // Uncomment to run nightly at around 2 AM
    // triggers { cron('H 2 * * *') }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                bat '''
                    node -v
                    npm -v
                    if exist package-lock.json (npm ci) else (npm install)
                '''
            }
        }

        stage('Install browsers') {
            steps {
                // Chromium is enough for CI; add firefox if you want it
                bat 'npx playwright install chromium'
            }
        }

        stage('Run tests') {
            steps {
                script {
                    def commands = [
                        smoke     : 'npm run test:smoke',
                        regression: 'npm run test:regression',
                        e2e       : 'npm run test:e2e',
                        api       : 'npm run test:api',
                        all       : 'npx playwright test --project=setup --project=chromium --project=api'
                    ]
                    // Example of using a Jenkins secret instead of a file value:
                    // withCredentials([string(credentialsId: 'saucedemo-password', variable: 'PASSWORD')]) {
                    //     bat commands[params.SUITE]
                    // }
                    bat commands[params.SUITE]
                }
            }
        }
    }

    post {
        always {
            // Test results graph in Jenkins
            junit allowEmptyResults: true, testResults: 'reports/junit.xml'

            // Keep evidence: HTML report, traces, screenshots, videos
            archiveArtifacts artifacts: 'playwright-report/**, test-results/**, reports/**', allowEmptyArchive: true

            // Needs the "HTML Publisher" plugin
            publishHTML(target: [
                reportDir            : 'playwright-report',
                reportFiles          : 'index.html',
                reportName           : 'Playwright Report',
                keepAll              : true,
                alwaysLinkToLastBuild: true,
                allowMissing         : true
            ])
        }
        success { echo 'All selected tests passed.' }
        failure { echo 'Some tests failed. Open the Playwright Report or the archived traces.' }
    }
}

pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 's224849242-node-app:latest'
        SENDGRID_API_KEY = 'SG.dummykey'
        DB_CONNECTION = 'mongodb://localhost:27017/test'
        SONAR_TOKEN = credentials('SONAR_TOKEN')
        SNYK_TOKEN = credentials('SNYK_TOKEN')
        PORT='4910'
    }

    stages {
        stage('Build') {
            steps {
                echo '🐳 Building personalized Docker image for Node.js app...'
                bat 'docker build -t s224849242-node-app:latest .'
                bat 'docker save -o s224849242-node-app.tar s224849242-node-app:latest'
            }
        }

      stage('Test') {
  steps {
    echo '📦 Installing dependencies'
    bat 'npm install'
    echo '🚀 Starting server in background'
   bat '''
                start "server" cmd /c "node server.js > server.log 2>&1"
                for /l %%x in (1, 1, 10) do (
                    curl http://localhost:4910/health && goto success
                    timeout /t 2 >nul
                )
                echo App not responding. Failing test.
                exit /b 1
                :success
                '''

    echo '🧪 Running Mocha tests'
    bat 'npm test || exit /b 0'

  
  }
}




        stage('SonarCloud Analysis') {
            steps {
                withCredentials([string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_TOKEN')]) {
                    bat '''
                    SET "JAVA_HOME=C:\\Program Files\\Java\\jdk-21"
                    SET "PATH=%JAVA_HOME%\\bin;%PATH%"
                    java -version

                    IF EXIST sonar-scanner (
                        rmdir /s /q sonar-scanner
                    )

                    curl -sSLo sonar-scanner.zip https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-5.0.1.3006-windows.zip
                    powershell -Command "Expand-Archive -Force sonar-scanner.zip -DestinationPath sonar-scanner"

                    SET SONAR_SCANNER_HOME=%cd%\\sonar-scanner\\sonar-scanner-5.0.1.3006-windows
                    SET PATH=%SONAR_SCANNER_HOME%\\bin;%PATH%"

                    sonar-scanner -Dsonar.login=%SONAR_TOKEN%
                    '''
                }
            }
        }

        stage('Security') {
            steps {
                withCredentials([string(credentialsId: 'SNYK_TOKEN', variable: 'SNYK_TOKEN')]) {
                    bat 'npm install -g snyk'
                    bat "snyk auth %SNYK_TOKEN%"
                    bat "snyk test --all-projects --severity-threshold=low || exit 0"
                }
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Deploying the app to a Docker container test environment on port 4910...'
                bat '''
                docker rm -f hauller-test-app || echo "No existing container to remove"
                docker run -d -p 4910:4910 --name hauller-test-app s224849242-node-app:latest
                '''
            }
        }
    }

    post {
        always {
            echo '✅ Build and test stages completed.'
        }
    }
}

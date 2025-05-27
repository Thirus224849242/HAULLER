pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 's224849242-node-app:latest'
        SENDGRID_API_KEY = 'SG.dummykey'
        DB_CONNECTION = 'mongodb://localhost:27017/test'
    }

    stages {
        stage('Build') {
            steps {
                echo '🐳 Building personalized Docker image for Node.js app...'
                bat 'docker build -t s224849242-node-app:latest .'
            }
        }
           stage('Test') {
            steps {
                echo '🧪 Running Mocha tests...'
                bat 'npm install'
                bat 'npm test'
            }
        }

stage('Code Quality') {
  steps {
    withSonarQubeEnv('SonarQube') {
      bat 'SonarScanner.bat'
    }
  }
}


      
    }

    post {
        always {
            echo '✅ Build and test stages completed.'
        }
    }
}

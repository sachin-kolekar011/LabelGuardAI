// This is jenkins file 

pipeline {
    agent any 

    stages {
        
        stage('Environment') {
            steps {
                sh 'node --version'
                sh 'npm --version'
            }
        }

        stage("Install Dependencies") {
            steps {
                sh 'npm ci'
            }
        }

        stage("Build") {
            steps {
                sh 'npm run build'
            }
        }
    }
}
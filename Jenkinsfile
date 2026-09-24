pipeline {
    agent any

    stages {

        stage('Environment') {
            steps {
                sh 'node --version'
                sh 'npm --version'
                sh 'aws --version'
            }
        }

        stage('CI Information') {
            steps {
                echo 'Build triggered automatically from GitHub'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy to S3') {
            steps {
                sh 'aws s3 sync dist/ s3://labelguardai.sachinkolekar.dev/'
            }
        }
    }
}
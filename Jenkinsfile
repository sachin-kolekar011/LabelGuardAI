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

        stage('Record Release') {
            steps {
                script {
                    def commit = sh(
                        script: 'git rev-parse --short HEAD',
                        returnStdout: true
                    ).trim()

                    echo "Realease commit : ${commit}"
                    echo "Jenkins build number: ${env.BUILD_NUMBER}"
                }

                archiveArtifacts(
                    artifacts: 'dist/**',
                    fingerprint: true
                )
            }
        }

        stage('Deploy to S3') {
            steps {
                sh 'aws s3 sync dist/ s3://labelguardai.sachinkolekar.dev/ --delete'
            }
        }
    }
}
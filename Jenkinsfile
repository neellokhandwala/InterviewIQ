pipeline {
    agent any

    tools {
        jdk "jdk17"
    }

    environment {
        AWS_REGION = 'ap-south-1'
        ECR_REPO = 'project-ecr-repo'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/neellokhandwala/InterviewIQ.git'
            }
        }

        stage('Terraform Apply') {
            steps {
                dir('infra') {
                    withAWS(credentials: 'aws-creds', region: "${AWS_REGION}") {
                        bat 'terraform init'
                        bat 'terraform apply -auto-approve'
                    }
                }
            }
        }

        stage('Get AWS Account ID') {
            steps {
                withAWS(region: "${AWS_REGION}", credentials: 'aws-creds') {
                    script {
                        def account = bat(
                            script: '@aws sts get-caller-identity --query Account --output text',
                            returnStdout: true
                        ).trim()

                        account = account.split("\n")[-1].trim()

                        env.AWS_ACCOUNT_ID = account
                        env.ECR_URI = "${account}.dkr.ecr.${AWS_REGION}.amazonaws.com"
                        env.IMAGE = "${env.ECR_URI}/${ECR_REPO}:${IMAGE_TAG}"

                        echo "Using image: ${env.IMAGE}"
                    }
                }
            }
        }

        stage('Clean Docker') {
            steps {
                bat "docker system prune -af"
            }
        }

        stage('Build Image') {
            steps {
                bat "docker build --no-cache -t ${IMAGE} ."
            }
        }

        stage('Push to ECR') {
            steps {
                withAWS(region: "${AWS_REGION}", credentials: 'aws-creds') {
                    bat """
                    aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_URI}

                    docker push ${IMAGE}

                    docker tag ${IMAGE} ${ECR_URI}/${ECR_REPO}:latest
                    docker push ${ECR_URI}/${ECR_REPO}:latest
                    """
                }
            }
        }

        stage('Deploy ECS') {
            steps {
                withAWS(region: "${AWS_REGION}", credentials: 'aws-creds') {
                    bat """
                    aws ecs update-service ^
                    --cluster project-ecs-cluster ^
                    --service project-ecs-service ^
                    --force-new-deployment ^
                    --region ${AWS_REGION}
                    """
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment Successful!'
        }
        failure {
            echo '❌ Deployment Failed! Check logs carefully.'
        }
    }
}
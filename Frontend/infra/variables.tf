variable "aws_region" {
  default = "ap-south-1"
}

variable "vpc_id" {
  default = "vpc-00615de11e6b01e45"
}

variable "subnet_ids" {
  default = ["subnet-0f1986ea60dcd4b2e", "subnet-02204c65881436aa7"]
}

variable "ecr_repo_name" {
  default = "project-ecr-repo"
}

variable "ecs_cluster_name" {
  default = "project-ecs-cluster"
}

variable "ecs_service_name" {
  default = "project-ecs-service"
}
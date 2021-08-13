# Adapted from https://github.com/terraform-aws-modules/terraform-aws-eks/blob/master/examples/managed_node_groups/variables.tf
variable "prefix" {
  description = "Repository prefix."
  default = "unguard"
  type = string
}

variable "region" {
  description = "AWS Region."
  default = "us-east-1"
  type = string
}
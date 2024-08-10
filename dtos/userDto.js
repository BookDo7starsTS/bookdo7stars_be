class UserDTO {
  constructor({
    name,
    email,
    password,
    mobile,
    policyyn,
    grade,
    recipient,
    post_code,
    address,
    address_detail,
    adminyn,
    status,
  }) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.mobile = mobile;
    this.policyyn = policyyn;
    this.grade = grade;
    this.recipient = recipient;
    this.post_code = post_code;
    this.address = address;
    this.address_detail = address_detail;
    this.adminyn = adminyn;
    this.status = status;
  }
}

export default UserDTO;

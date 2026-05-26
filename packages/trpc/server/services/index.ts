import UserService from "@repo/services/user";
import FromService from "@repo/services/form";
import FormFeildService from "@repo/services/form-feild";
import FormSubmissionService from "@repo/services/form-submission";

export const userService = new UserService();
export const formService = new FromService();
export const formFeildService = new FormFeildService();
export const formSubmissionService = new FormSubmissionService();

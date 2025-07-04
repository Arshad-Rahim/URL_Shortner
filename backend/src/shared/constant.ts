

export enum HTTP_STATUS {
    OK= 200,
    CREATED= 201,
    BAD_REQUEST= 400,
    UNAUTHORIZED= 401,
    FORBIDDEN= 403,
    NOT_FOUND= 404,
    CONFLICT= 409,
    INTERNAL_SERVER_ERROR= 500,
    GONE = 410,
  };

  
  export const SUCCESS_MESSAGES = {
    TOKEN_REFRESHED:"Token refreshed",
    OPERATION_SUCCESS: "Opearation Succesfull",
    CREATED: "Created successfully.",
    LOGIN_SUCCESS: "Login successful.",
    REGISTRATION_SUCCESS: "Registration completed successfully.",
    LOGOUT_SUCCESS: "Logged out successfully.",
    UPDATE_SUCCESS: "Updated successfully.",
    DELETE_SUCCESS: "Deleted successfully.",
    VERIFICATION_SUCCESS: "Verification completed successfully.",
    DATA_RETRIEVED_SUCCESS: "Data fetched successfully",
  };

  export const ERROR_MESSAGES = {
    TOO_MANY_REQUESTS:"Too many requests, please try again later",
    INVALID_REFRESH_TOKEN:"Invalid refresh token",
    REFRESH_TOKEN_REQUIRED:'Refresh token is required',
    SHORT_CODE_EXISTS:"Short code alredy exist",
    INVALID_SHORT_CODE:"Invalid short code",
    INVALID_URL:"Invalid URL",
    URL_NOT_FOUND:"URL is not found",
    ORIGINAL_URL_REQUIRED:"Original URL is required",
    UNAUTH_NO_USER_FOUND: "Unauthorized: No user found in request",
    INCOMPLETE_INFO: "Incomplete information.",
    ID_REQUIRED: "ID required",
    TOKEN_EXPIRED: "Token Expired",
    EMAIL_NOT_FOUND: "Email Not Found",
    FORBIDDEN:
      "Access denied. You do not have permission to access this resource.",
    NOT_ALLOWED: "You are not allowed",
    EMAIL_EXISTS: "Email Already Exists",
    INVALID_TOKEN: "Invalid token",
    INVALID_CREDENTIALS: "Invalid credentials provided.",
    USER_NOT_FOUND: "User not found.",
    UNAUTHORIZED_ACCESS: "Unauthorized access.",
    SERVER_ERROR: "An error occurred, please try again later.",
    VALIDATION_ERROR: "Validation error occurred.",
    MISSING_PARAMETERS: "Missing required parameters.",
    ROUTE_NOT_FOUND: "Route not found.",
    ID_NOT_PROVIDED: "ID not provided",
    INVALID_PASSWORD: "Password Doesnot Match",
    GOOGLE_USER:
      "This user is an google auth user no password change is possible",
    NO_REFRESH_TOKEN: "There is no refresh token",
  };
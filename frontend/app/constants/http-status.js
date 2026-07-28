import { HttpStatusCode } from 'axios'
const HTTP_STATUS = HttpStatusCode
const isSuccessStatus = (status) => {
  return status >= HttpStatusCode.Ok && status < HttpStatusCode.MultipleChoices
}
export { HTTP_STATUS, HttpStatusCode, isSuccessStatus }

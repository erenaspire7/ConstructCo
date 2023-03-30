import { HttpHeaders } from "@angular/common/http"

const decimalRegex = /^\d*\.?\d+$/
const numberRegex = /^\d+$/

const httpHeaders = new HttpHeaders()
    .set("Access-Control-Allow-Origin", "*")
    .set('Content-Type', 'application/json')

export { decimalRegex, numberRegex, httpHeaders }

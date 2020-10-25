const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const getModel = require("/model");
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
const app = express();
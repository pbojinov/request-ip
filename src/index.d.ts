export interface IRegexes {
  ipv4: RegExp;
  ipv6: RegExp;
}

export interface IOptions {
  attributeName: string;
}

export interface IRequest {
  headers: any;
  requestContext: any;
  connection: any;
  socket: any;
  info: any;
  raw: any;
}

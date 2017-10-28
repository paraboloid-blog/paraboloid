let re = require('randexp');

export const username = new re(/[a-zA-Z0-9]{1,30}/).gen();
export const username_invalid = new re(/[^a-zA-Z0-9]{1,30}/).gen();
export const username_long = new re(/[a-zA-Z0-9]{31,}/).gen();
export const email = new re(/\w{1,30}@\w{1,15}\.\w{1,3}/).gen();
export const email_long = new re(/\w{50,}@\w{1,15}\.\w{1,3}/).gen();
export const email_new = new re(/\w{1,30}@\w{1,15}\.\w{1,3}/).gen();
export const email_invalid = new re(/\w{1,50}/).gen();
export const password = new re(/\S{1,100}/).gen();
export const password_new = new re(/\S{1,100}/).gen();
export const bio = new re(/.{1,10000}/).gen();
export const bio_long = new re(/.{10001,}/).gen();
export const bio_new = new re(/.{1,10000}/).gen();
export const image = new re(/\w{1,196}\.\w{1,3}/).gen();
export const image_long = new re(/\w{200,}\.\w{1,3}/).gen();
export const image_new = new re(/\w{1,196}\.\w{1,3}/).gen();
export const image_invalid = new re(/\w{1,200}/).gen();
export const token_id = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5ZWM5Y2Q5ZDlkODZjNzY4N2NiYTcxYyJ9.Iqxjp9zj9bmgzCYhhGYhV-o5_HwxAOWwZK0uiNdEO0Q';
export const token_user = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QifQ.FILrByQNl1Mx00RSZonmT3p5waGlFaymZJ3e3a5VBac';
export const token_invalid = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QifQ==.vSRUKiX6KVqh+YMpxfzkgXOS/M7SWobEPv0jpBW3n8M=';
export const title = new re(/.{1,100}/).gen();
export const description = new re(/.{1,1000}/).gen();
export const body = new re(/.{1,100000}/).gen();
export const tags = (new re(/(\w{1,30},){1,}\w{1,30}/).gen()).split(',');

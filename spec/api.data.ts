import * as crypto from 'crypto';

let getHexString = (length: number) => crypto.randomBytes(length).toString('hex');

export const username = getHexString(5);
export const username_invalid = getHexString(5) + '-' + getHexString(5);
export const username_long = getHexString(30);
export const email = getHexString(5) + '@' + getHexString(5) + '.' + getHexString(1);
export const email_long = getHexString(50) + '@' + getHexString(5) + '.' + getHexString(1);
export const email_new = getHexString(5) + '@' + getHexString(5) + '.' + getHexString(1);
export const email_invalid = getHexString(5) + '.' + getHexString(1);
export const password = getHexString(5);
export const bio = getHexString(100);
export const bio_long = getHexString(10000);
export const bio_new = getHexString(100);
export const image = getHexString(10) + '.' + getHexString(1);
export const image_long = getHexString(200) + '.' + getHexString(1);
export const image_new = getHexString(10) + '.' + getHexString(1);
export const image_invalid = getHexString(10);
export const token_id = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU5ZWM5Y2Q5ZDlkODZjNzY4N2NiYTcxYyJ9.Iqxjp9zj9bmgzCYhhGYhV-o5_HwxAOWwZK0uiNdEO0Q';
export const token_user = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QifQ.FILrByQNl1Mx00RSZonmT3p5waGlFaymZJ3e3a5VBac';
export const token_invalid = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QifQ==.vSRUKiX6KVqh+YMpxfzkgXOS/M7SWobEPv0jpBW3n8M=';

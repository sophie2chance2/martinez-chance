import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import handler from '../api/rsvp.js';
const { privateKey } = crypto.generateKeyPairSync('rsa', { modulusLength: 2048 });
process.env.GOOGLE_SHEET_ID = 'test';
process.env.RSVP_SHEET_NAME = 'RSVP';
process.env.GOOGLE_SERVICE_ACCOUNT_JSON = JSON.stringify({ client_email: 'test@example.com', private_key: privateKey.export({ type: 'pkcs8', format: 'pem' }) });
const headers = ['submitted_at','household','guest_name','attending','welcome_drinks','wedding','brunch','meal','dietary','birthday','email','Street','City','State','Zip'];
const row = (group, name, date='2026-11-07T21:58:58Z') => [date,group,name,'Attending'];
let rows, appended, updated, failRead, failUpdate;
function reset(data) { rows=[headers,...data]; appended=0; updated=[]; failRead=false; failUpdate=false; }
const reply = (payload, ok=true) => ({ ok, json: async()=>payload });
globalThis.fetch = async (url, options={}) => {
  if (url.includes('oauth2')) return reply({access_token:'test'});
  if (!options.method) return failRead ? reply({error:{message:'Read failed'}},false) : reply({values:rows});
  const body=JSON.parse(options.body);
  if (url.includes(':batchUpdate')) {
    if(failUpdate)return reply({error:{message:'Update failed'}},false);
    for(const change of body.data){const i=Number(change.range.match(/!A(\d+):/)[1])-1;rows[i]=change.values[0];updated.push(i+1);}
  } else if(url.includes(':append')){rows.push(...body.values);appended+=body.values.length;}
  else throw Error('Unexpected request');
  return reply({});
};
async function submit(responses, address={}) {
  let status,body;
  await handler({method:'POST',body:{action:'submit',responses,...address}}, {status(value){status=value;return this},json(value){body=value}});
  return {status,body};
}
reset([row('11','Eesha Sheth','2026-11-07T21:56:52Z'),row('11','Ravi Patel','2026-11-07T21:56:52Z'),[],row('11','Eesha Sheth'),row('11','Ravi Patel'),row('12','Ravi Patel')]);
const guests=[{household:'11',guestName:'Eesha Sheth',attending:'Declined'},{household:'11',guestName:'Ravi Patel',attending:'Declined'}];
assert.equal((await submit(guests)).status,200);
assert.deepEqual(updated,[5,6]);assert.equal(appended,0);assert.equal(rows[7-1][3],'Attending');
assert.equal((await submit(guests)).status,200);assert.equal(rows.length,7);assert.equal(appended,0);
assert.equal((await submit([{household:' 11 ',guestName:' RAVI PATEL '}])).status,200);
assert(rows[5].slice(3).every(value=>value===''));assert.equal(appended,0);
reset([row('11','Eesha Sheth')]);
const mixed=[{household:'11',guestName:'Eesha Sheth'},{household:'11',guestName:'New Guest'}];
await submit(mixed);assert.equal(appended,1);assert.deepEqual(updated,[2]);
await submit(mixed);assert.equal(appended,1);assert.equal(rows.length,3);
reset([]);await submit([mixed[1],mixed[1]]);assert.equal(appended,1);
reset([row('11','Ravi Patel')]);failRead=true;assert.equal((await submit(guests)).status,500);assert.equal(appended,0);
failRead=false;failUpdate=true;assert.equal((await submit(guests)).status,500);assert.equal(appended,0);
assert.equal((await submit([{guestName:'Missing household'}])).status,400);
console.log('PASS: latest-row edits, repeat submissions, household isolation, blank answers, mixed new/existing guests, duplicate request entries, and safe failure handling.');

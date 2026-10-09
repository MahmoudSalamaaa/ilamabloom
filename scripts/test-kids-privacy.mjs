import {test} from 'node:test';
import assert from 'node:assert/strict';
import {loadTypeScript} from './load-kids-test.mjs';
const {analyticsEvent}=loadTypeScript('lib/analytics/privacy.ts');
const event=path=>({event:'page_view',anonymousId:'anonymous-123',path});
test('server discards children and guardian analytics before database access',()=>{
 for(const path of ['/kids','/kids?lang=ar','/kids/child','/parent','/parent/export','/%6bids','/KIDS','/account','/auth/sign-in','/api/kids/profiles','/#kids','/#/kids?lang=ar','/#%6bids','/#parent'])assert.equal(analyticsEvent(event(path)),null,path);
});
test('public counts discard queries and all free-form fragments',()=>{
 for(const path of ['/learn?nickname=Noor#private-notes','/learn#private-notes'])assert.deepEqual(analyticsEvent(event(path)),{event:'page_view',anonymousId:'anonymous-123',path:'/learn'});
 assert.equal(analyticsEvent(event('/kids-other')).path,'/kids-other');
});
test('analytics accepts only bounded page counts and safe anonymous identifiers',()=>{
 for(const input of [null,[],{}, {...event('/'),event:'camera'}, {...event('/'),anonymousId:'Name with notes'}, {...event('/'),anonymousId:'x'.repeat(81)}, event('https://evil.invalid'),event('//evil.invalid'),event('/%ZZ'),event('/#%ZZ'),event('/'+'x'.repeat(500))])assert.throws(()=>analyticsEvent(input),error=>error.status===400);
});

import { defineRule, configure } from 'vee-validate';
import {all} from '@vee-validate/rules';
import { localize, setLocale } from '@vee-validate/i18n';
import zhTW from '@vee-validate/i18n/dist/locale/zh_TW.json';

Object.keys(all).forEach(rule => {
  defineRule(rule, all[rule]);
});

configure({
  generateMessage: localize({ zh_TW: zhTW })
});

setLocale('zh_TW');

export default defineNuxtPlugin(_nuxtApp => {});
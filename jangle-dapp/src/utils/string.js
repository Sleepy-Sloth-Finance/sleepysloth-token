import React from 'react';
import web3 from 'web3';
import dayjs from 'dayjs';
import BigNumber from 'bignumber.js';

/**
 *
 *
 * @name formatDate
 * @description Formats single or multiple dates and returns a string. Accepts 2 arguments.
 * @param  {String} date unformatted date
 * @param  {String} customFormat (Optional) argument for a custom format returned
 * @return {String} "ddd, MMM D, h:mma - ddd, MMM D, h:mma"
 */
export const formatDate = (date, customFormat) => {
  date = dayjs(date);
  if (customFormat) {
    return date.format(customFormat);
  }
  return date.format('MMMM D, YYYY');
};
/**
 *
 *
 * @name titleCase
 * @description Returns string with first letter capatalized
 * @param {String} string  Transformed string
 * @returns {String}
 */
export const titleCase = (string) => {
  return string[0].toUpperCase() + string.slice(1);
};
/**
 *
 *
 * @name parseHtmlJson
 * @description Returns JSX for dangerouslySetInnerHTML Prop
 * @param {String} string  { __html: string };
 * @returns {JSX}
 */
export const parseHtmlJson = (htmlJson) => {
  return { __html: htmlJson };
};
/**
 *
 *
 * @name RenderHtmlJson
 * @description Returns JSX for dangerouslySetInnerHTML Prop
 * @param {String} string  <div {...props} dangerouslySetInnerHTML={{ __html: json }} />
 * @returns {JSX}
 */
export const RenderHtmlJson = ({ json, ...props }) => {
  const regex = /(<([^>]+)>)/gi;
  const removeHtmlJson = json.replace(regex, '');
  return (
    <div {...props} dangerouslySetInnerHTML={{ __html: removeHtmlJson }} />
  );
};
/**
 *
 *
 * @name getExcerpt
 * @description Returns an excerpt from a longer string
 * @param {String} content      Longer block of content
 * @param {Number} approxLength Number of characters desired, approximately
 * @returns {String}
 */
export const getExcerpt = (content, approxLength, ellipsis) => {
  if (content.length <= approxLength) {
    return content;
  }
  // Split content by words
  const contentArray = content.substr(0, approxLength).split(' ');
  // Set the last "word" in the array to an ellipsis
  if (!ellipsis) {
    return contentArray.join(' ');
  }
  contentArray[contentArray.length - 1] = '...';
  return contentArray.join(' ');
};
/**
 *
 *
 * @name noSpaceBetween
 * @description Trims whitespace in a string for URL encoding
 * @param {String} string     A single string with white space.
 * @returns {String}
 */
export const noSpaceBetween = (str) => {
  if (/\s/.test(str)) {
    return str.replace(/\s/g, '');
  }
  return str.toLowerCase();
};
/**
 *
 *
 * @name trim
 * @description Trims a string if it exists, else returns blank string
 * @param {String} str     String to trim spaces from
 * @returns {String}
 */
export const trim = (str) =>
  str && str.length ? str.replace(/^\s+|\s+$/gm, '') : '';

/**
 *
 *
 * @name isNullEmptyOrUndefined
 * @description Checks to see if the parameter is null,
 * empty, or undefined.
 * @param {*} str Item to verify
 * @returns {Boolean}
 */
export const isNullEmptyOrUndefined = (str) => {
  if (Array.isArray(str)) {
    return !str.length > 0;
  } else
    return (
      str === null ||
      typeof str === 'undefined' ||
      (typeof str === 'string' && trim(str) === '')
    );
};

/**
 *
 *
 * @name trimSpaces
 * @description Trims spaces in strings
 * @param {*} str Item to trim space
 * @returns String
 */
export const trimSpaces = (str) => {
  str = str.replace(/\s/g, '');
  return str;
};

/** */
export function transform(
  value,
  decimals = 2,
  format = true,
  asBN = false,
  round = true
) {
  const formatNumberParams = {
    groupSeparator: ',',
    groupSize: 3,
    decimalSeparator: '.',
  };

  const bigNumberValue = new BigNumber(value).div(Math.pow(10, decimals));

  if (bigNumberValue.isNaN()) {
    return value;
  }

  if (format) {
    return round || decimals || decimals === 0
      ? bigNumberValue.dp(round || decimals).toFormat(formatNumberParams)
      : '';
  } else if (!asBN) {
    return bigNumberValue.toString(10);
  } else {
    return bigNumberValue;
  }
}

/**
 *
 *
 * @name numberWithCommas
 * @description Adds commas to every thousands place on a number
 * @param {*} str Item to trim space
 * @returns String
 */
export function numberWithCommas(x, fixed = 2) {
  var parts = parseFloat(x).toFixed(fixed).toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

export function withCommas(fixed = 2) {
  var parts = parseFloat(this).toFixed(fixed).toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

function shorten(fixed = 0, fixed2IfBillion = false) {
  // Alter numbers larger than 1k
  if (this >= 1e3) {
    var units = ['k', 'M', 'B', 'T'];

    // Divide to get SI Unit engineering style numbers (1e3,1e6,1e9, etc)
    let unit = Math.floor((this.toFixed(0).length - 1) / 3) * 3;
    // Calculate the remainder
    let unitname = units[Math.floor(unit / 3) - 1];
    let num;
    if (fixed2IfBillion && unitname === 'B') {
      num = (this / ('1e' + unit)).toFixed(2);
      return num + unitname;
    } else {
      num = (this / ('1e' + unit)).toFixed(fixed);
      return num + unitname;
    }

    // output number remainder + unitname
  }

  // return formatted original number
  return this.toLocaleString();
}

export function shortenAddress() {
  if (web3.utils.isAddress(this))
    return `${this.substring(0, 6)}...${this.slice(-4)}`;
  else return `0x0000...0000`;
}

export function toHHMMSS() {
  var time = this;
  var ms = time % 1000;
  time = (time - ms) / 1000;
  var secs = time % 60;
  time = (time - secs) / 60;
  var mins = time % 60;
  var hrs = (time - mins) / 60;

  if (hrs < 10) hrs = `0${hrs}`;
  if (mins < 10) mins = `0${mins}`;
  if (secs < 10) secs = `0${secs}`;

  return hrs + ':' + mins + ':' + secs;
}

function web3ReadableFixed(fixed = 3) {
  var value = this;

  return numberWithCommas(web3.utils.fromWei(value), fixed);
}
function web3Readable() {
  var value = this;

  return web3.utils.fromWei(value);
}

// Add method to prototype. this allows you to use this function on numbers and strings directly

// eslint-disable-next-line
String.prototype.shorten = shorten;
// eslint-disable-next-line
String.prototype.numberWithCommas = withCommas;
// eslint-disable-next-line
String.prototype.shortenAddress = shortenAddress;
// eslint-disable-next-line
String.prototype.web3Readable = web3Readable;
// eslint-disable-next-line
String.prototype.web3ReadableFixed = web3ReadableFixed;

// eslint-disable-next-line
Number.prototype.numberWithCommas = withCommas;
// eslint-disable-next-line
Number.prototype.shorten = shorten;
// eslint-disable-next-line
Number.prototype.toHHMMSS = toHHMMSS;

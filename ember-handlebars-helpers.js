//
//== Word Helpers
//

Ember.Handlebars.helper('pluralize', function(count, singularString) {
  var inflector, string;

  if (count === 1) {
    string = singularString;
  } else {
    inflector = Ember.Inflector.inflector;
    string = inflector.pluralize(singularString);
  }

  return "" + count + " " + string;
});

//
//== Number Helpers
//

Ember.Handlebars.helper('format-decimal-as-percent', function(decimal, options) {
  var decimalPlaces, escaped, percent;

  decimalPlaces = options.hash['decimalPlaces'] || 0;
  percent = Math.round(decimal * 100, decimalPlaces);
  escaped = Handlebars.Utils.escapeExpression(percent);

  return new Handlebars.SafeString('<span class="percent">' + escaped + '%</span>');
});

//
//== Date/Time Helpers
//

Ember.Handlebars.helper('format-date', function(date, options) {
  // Options:
  //   relative
  //    Usage: Set to true to use a relative format like "1 day ago"
  //    Default: false

  var dateString, escaped;

  if (options.hash.relative) {
    dateString = moment(date).fromNow();
  } else if (options.hash.short) {
    dateString = moment(date).format('MMM DD');
  } else if (options.hash.datetime) {
    dateString = moment(date).format('YYYY-MM-DD HH:MM:ss');
  } else {
    dateString = moment(date).format('MM/DD/YYYY');
  }
  escaped = Handlebars.Utils.escapeExpression(dateString);

  return new Handlebars.SafeString('<span class="date">' + escaped + '</span>');
});

//
//== Currency Helpers
//

Ember.Handlebars.helper('format-currency', function(value, options) {
  // Options:
  //   colorValue
  //     Usage: Set to 'true' to add a CSS class for the sign of the value.
  //     Accepts: string, only option is 'true'
  //     Default: <blank string>
  //     Example: {{ formatCurrency myValue colorValue='true' }}
  //              -1000.01 => <span class='currency negative'>-1,000.01</span>

  //   currencySign
  //     Usage: Pass a string in to be prepended to the value.
  //     Accepts: string
  //     Default: <blank string>.
  //     Example: {{ formatCurrency myValue currencySign='$' }}
  //              1000.01 => $1,000.01

  //   hideDecimals
  //     Usage: Set to 'true' to hide decimal point and decimal places.
  //     Accepts: string, only option is 'true'
  //     Default: If not set, decimal point and places are shown.
  //     Example: {{ formatCurrency myValue hideDecimals='true' }}
  //              1000.01 => 1,000

  //   separator
  //     Usage: Pass in a string to separate every three digits with.
  //     Accepts: string
  //     Default: Every three digits to the left of the decimal point are separated by a comma.
  //     Example: {{ formatCurrency myValue separator='.' }}
  //              1000.01 => 1.000.01

  //   stripSign
  //     Usage: Set to 'true' to remove the plus or minus sign if the value starts with one.
  //     Accepts: string, only option is 'true'
  //     Default: If not set to true, the sign is shown in front of the value.
  //     Example: {{ formatCurrency myValue stripSign='true' }}
  //              -1000.01 => 1,000.01

  var centsString, centsValue, colorClass, colorValue, currencySign, dollarString, dollarValue, escapedValue, hideDecimals, separator, splitValue, stripSign;

  if (!value) {
    return '';
  }
  currencySign = options.hash['currencySign'] || '$';
  hideDecimals = options.hash['hideDecimals'] === 'true';
  separator = options.hash['separator'] || ',';
  stripSign = options.hash['stripSign'] === 'true';
  colorValue = options.hash['colorValue'] === 'true';
  colorClass = colorValue ? (value < 0 ? 'negative' : 'positive') : '';
  splitValue = value.toString().split('.');
  dollarValue = (stripSign ? splitValue[0].replace(/^(-|\+)/, '') : splitValue[0]) || '0';
  centsValue = splitValue[1] ? (splitValue[1].toString() + "00").substring(0, 2) : '00';
  centsString = hideDecimals ? '' : '.' + centsValue;
  dollarString = separator ? dollarValue.replace(/\B(?=(\d{3})+(?!\d))/g, separator) : dollarValue;
  escapedValue = Handlebars.Utils.escapeExpression(currencySign + dollarString + centsString);

  return new Handlebars.SafeString('<span class="currency ' + colorClass + '">' + escapedValue + '</span>');
});

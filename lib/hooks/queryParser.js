import queryString from 'query-string';

export const tiniQueryParse = (query) => {
  if (!query) return {};
  let queryFrom = query.indexOf('?');
  let queryFromOffset = 1;
  if (queryFrom < 0) {
    queryFrom = query.indexOf('%3F');
    queryFromOffset = 3;
  }
  if (queryFrom >= 0) query = query.substr(queryFrom + queryFromOffset);

  let objQuery = queryString.parse(query);

  if ('source_screen' in objQuery || 'utm_source' in objQuery) {
    objQuery['source_screen'] = objQuery['source_screen'] || objQuery['utm_source'];
    if (objQuery['source_screen'].startsWith('tiki_')) {
      objQuery['source_screen'] = objQuery['source_screen'].substring(5);
    }
  }

  // add extraData
  Object.keys(objQuery).forEach((key) => {
    if (!key.startsWith('referrerInfo=')) return;
    const jsonData = key.slice('referrerInfo='.length);
    try {
      objQuery.extraData = JSON.parse(jsonData).extraData;
      objQuery = { ...objQuery.extraData, ...objQuery };
    } catch (error) {}
  });

  return objQuery;
};

/**
 * @param {(Record<string, any>) => any} callback
 * @returns
 */
const hookQueryParser = () => {
  return {
    onLoad: function (query, ...args) {
      return [tiniQueryParse(query), ...args];
    },
  };
};

export default hookQueryParser;

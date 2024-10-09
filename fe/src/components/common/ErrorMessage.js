// src/components/common/ErrorMessage.js
import React from 'react';
import PropTypes from 'prop-types';

const ErrorMessage = ({ error }) => {
  if (!error) return null;

  const message =
    typeof error === 'string'
      ? error
      : error.message
      ? error.message
      : 'An unexpected error occurred.';

  return <p className="text-red-600">{message}</p>;
};

ErrorMessage.propTypes = {
  error: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default ErrorMessage;

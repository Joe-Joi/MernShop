import React from 'react';
import { Helmet } from 'react-helmet';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keyword" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Welcome To Southampton Book Exchange Platform!',
  description:
    'This is a book exchange platform for students in University of Southampton ',
  keywords: 'buy books, sell books',
};

export default Meta;

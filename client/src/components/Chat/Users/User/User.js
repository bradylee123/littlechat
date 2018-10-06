import React from 'react';

import styles from './User.css';

const user = (props) => {
    return (
      <div className={styles.User}>
          <strong>{props.username}</strong>
      </div>
    )
};

export default user;

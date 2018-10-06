import React from 'react';

import styles from './Message.css';

const message = (props) => {
    return (
      <div className={styles.Message}>
          <p><strong>{props.from}: </strong> {props.text}</p>
      </div>
    )
};

export default message;

import React from 'react';

interface Props {
  title?: string;
  children: JSX.Element | JSX.Element[];
}

export function Page({title, children}: Props) {
  const titleMarkup = title ? <h1>{title}</h1> : null;
  return (
    <>
      {titleMarkup}
      <main>{children}</main>
    </>
  );
}

import App, { Container } from 'next/app';
import Router from 'next/router';
import { Global, css } from '@emotion/core';
import ContextProvider from '../context/providers/contextProvider.jsx';
import Head from 'next/head';
import React from 'react';
import NProgress from 'nprogress';
import '../assets/nprogress.less';

Router.events.on('routeChangeStart', () => {
  NProgress.start();
});
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export default class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <title>Frontend template!</title>
        </Head>
        <ContextProvider>
          <Global
            styles={css`
              body {
                min-height: 100%;
              }

              * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
              }

              html {
                height: 100%;
              }

              #__next {
                min-height: 100vh;
              }
            `}
          />
          <Container>
            <Component {...pageProps} />
          </Container>
        </ContextProvider>
      </>
    );
  }
}

import { render, screen } from '@testing-library/react';
import Main from './Main';
import App from '../App'

import { MeetingProvider } from 'amazon-chime-sdk-component-library-react';

test('Main page render test', () => {
  render(<MeetingProvider><Main /></MeetingProvider>);
  const linkElement = screen.getByText(/학교별 매너학점/i);
  expect(linkElement).toBeInTheDocument();
});

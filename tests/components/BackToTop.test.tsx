import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import BackToTopButton from '@/src/components/BackToTop';

describe('BackToTopButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(window, 'scrollTo', {
      writable: true,
      value: jest.fn(),
    });
  });

  test('does not render the button on initial load', () => {
    render(<BackToTopButton />);
    const button = screen.queryByRole('button', { name: /back to top/i });
    expect(button).not.toBeInTheDocument();
  });

  test('renders the button after scrolling past 300px', () => {
    render(<BackToTopButton />);

    // Simulate scroll event
    act(() => {
      window.scrollY = 350;
      window.dispatchEvent(new Event('scroll'));
    });

    const button = screen.getByRole('button', { name: /back to top/i });
    expect(button).toBeInTheDocument();
  });

  test('calls `scrollTo` when the button is clicked', () => {
    render(<BackToTopButton />);

    // Make the button visible by scrolling past 300px
    act(() => {
      window.scrollY = 350;
      window.dispatchEvent(new Event('scroll'));
    });

    const button = screen.getByRole('button', { name: /back to top/i });

    // Simulate button click
    fireEvent.click(button);

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  test('removes the scroll event listener on component unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = render(<BackToTopButton />);

    unmount(); // Simulate unmounting the component

    expect(removeEventListenerSpy).toHaveBeenCalledWith('scroll', expect.any(Function));
  });
});

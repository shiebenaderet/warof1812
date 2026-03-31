import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ManageStudents from '../ManageStudents';

const mockStudents = [
  { sessionId: 's1', playerName: 'Alice', displayName: null, classId: 'c1', gameCount: 3, scores: [] },
  { sessionId: 's2', playerName: 'Bob', displayName: 'Robert', classId: 'c1', gameCount: 1, scores: [] },
  { sessionId: 's3', playerName: 'alice', displayName: null, classId: 'c2', gameCount: 2, scores: [] },
];

const mockClasses = [
  { id: 'c1', name: 'Period 1', code: 'ABC123' },
  { id: 'c2', name: 'Period 2', code: 'DEF456' },
];

const defaultProps = {
  students: mockStudents,
  classes: mockClasses,
  onRename: jest.fn(),
  onMove: jest.fn(),
  onMerge: jest.fn(),
  selectedClass: '',
};

describe('ManageStudents', () => {
  test('renders student table with names', () => {
    render(<ManageStudents {...defaultProps} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Robert')).toBeInTheDocument();
    expect(screen.getByText('(was: Bob)')).toBeInTheDocument();
  });

  test('returns null when no students', () => {
    const { container } = render(<ManageStudents {...defaultProps} students={[]} />);
    expect(container.firstChild).toBeNull();
  });

  test('shows duplicate indicator for case-insensitive name matches', () => {
    render(<ManageStudents {...defaultProps} />);
    const dupeLabels = screen.getAllByText('Possible duplicate');
    expect(dupeLabels.length).toBeGreaterThanOrEqual(2);
  });

  test('clicking pencil icon opens inline rename', () => {
    render(<ManageStudents {...defaultProps} />);
    const renameButtons = screen.getAllByTitle('Rename');
    fireEvent.click(renameButtons[0]);
    expect(screen.getByDisplayValue('Alice')).toBeInTheDocument();
  });

  test('merge button appears when 2+ students selected', () => {
    render(<ManageStudents {...defaultProps} />);
    const checkboxes = screen.getAllByRole('checkbox');
    // checkboxes[0] is select-all, [1] is Alice, [2] is Robert, [3] is alice
    fireEvent.click(checkboxes[1]);
    fireEvent.click(checkboxes[2]);
    expect(screen.getByText(/Merge Selected/)).toBeInTheDocument();
  });

  test('class dropdown calls onMove', () => {
    const onMove = jest.fn();
    render(<ManageStudents {...defaultProps} onMove={onMove} />);
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[0], { target: { value: 'c2' } });
    expect(onMove).toHaveBeenCalledWith('s1', 'c2');
  });
});

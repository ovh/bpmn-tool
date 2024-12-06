export type BpmnLintIssue = {
  category: string;
};

export type PropertiesPanel = {
  attachTo: (parentNode: HTMLElement) => void;
  registerProvider: (priority: number, provider: any) => void;
};

export type BpmnLintIssues = Record<string, BpmnLintIssue[]>;

export const checkForLinterIssues = (issues: BpmnLintIssues) => {
  return Object.keys(issues).some((issueKey: string) =>
    issues[issueKey].some(({ category }) => category === 'error'),
  );
};

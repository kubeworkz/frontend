import { AnyLink } from '../../components/AnyLink/AnyLink';
import {
  DOCUMENTATION_URL_API_SPEC,
  DOCUMENTATION_URL_IMPORT_DATA_TO_CLOUDROCK,
  DOCUMENTATION_URL_QUICKSTART_GUIDE,
} from '../../config/config';
import { generatePath } from 'react-router-dom';
import { CodeBlock, HighlightedCodeBlock } from '../../components/Code/Code';
import { OnboardingContent } from '../../components/Layout/Onboarding/Onboarding';
import { ConsoleRoutes } from '../../routes/routes';
import { useProjectsItemContext } from '../hooks/projectsItem';

const SqlStepContent = () => {
  const { projectId } = useProjectsItemContext();

  return (
    <>
      <p>
        Try generating sample data and querying it from the
        {' '}
        <AnyLink to={generatePath(ConsoleRoutes.ProjectsItemQuery, { projectId })}>
          SQL Editor
        </AnyLink>
        .
      </p>
      <HighlightedCodeBlock
        mode="sql"
        height="104px"
      >
        {'CREATE TABLE playing_with_cloudrock(name TEXT NOT NULL, value REAL);\n'
        + 'INSERT INTO playing_with_cloudrock(name, value)\n'
        + 'SELECT LEFT(md5(i::TEXT), 10), random() FROM generate_series(1, 10) s(i);\n'
        + 'SELECT * FROM playing_with_cloudrock;'}
      </HighlightedCodeBlock>
    </>
  );
};

export const CONTENT: OnboardingContent = [
  [
    'Try Cloudrock\'s SQL Editor',
    (
      <SqlStepContent />
    ),
  ],
  [
    'Try Cloudrock\'s psql passwordless auth',
    <>
      <p>
        Make sure you have psql, a terminal-based front-end to Postgres, installed.
        <br />
        Run the following command:
      </p>
      <CodeBlock>
        psql -h pg.cloudrock.ca
      </CodeBlock>
      <p>
        Follow the instructions on the screen to connect.
      </p>
    </>,
  ],
  [
    'Integrate your app with Cloudrock',
    <p>
      Follow one of our
      {' '}
      <AnyLink
        as="a"
        target="_blank"
        href={DOCUMENTATION_URL_QUICKSTART_GUIDE}
      >
        guides
      </AnyLink>
      {' '}
      to integrate your application with Cloudrock.
    </p>,
  ],
  [
    'Explore the Cloudrock API',
    <>
      <p>
        Integrate Cloudrock into your CI/CD pipeline with
        {' '}
        <AnyLink
          as="a"
          target="_blank"
          href={DOCUMENTATION_URL_API_SPEC}
        >
          the Cloudrock API
        </AnyLink>
        .
      </p>
    </>,
  ],
  [
    'Import your data',
    <p>
      Follow our
      {' '}
      <AnyLink
        as="a"
        href={DOCUMENTATION_URL_IMPORT_DATA_TO_CLOUDROCK}
        target="_blank"
      >
        guide
      </AnyLink>
      {' '}
      to import your data to Cloudrock.
    </p>,
  ],
];

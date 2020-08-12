#!/bin/bash

## TODO: Port to TS

BASENAME=$(basename $PWD)

if [ ${CI} ]; then
  REPORTDIR=/home/circleci/project/reports/junit/${BASENAME}
  echo Creating ${REPORTDIR}
  mkdir -p ${REPORTDIR}
  export ESLINT_OPTS="--format junit -o ${REPORTDIR}/eslint.xml"
fi

echo "Linting w/eslint ${BASENAME}..."
./node_modules/.bin/eslint --ext .ts,.js ${ESLINT_OPTS} .
retVal=$?
if [ $retVal -ne 0 ]; then
	echo "Linter Error"
	exit $retVal
fi

echo "Linting w/prettier ${BASENAME}..."
../../repo-tools/node_modules/.bin/pretty-quick --pattern "**/*.*(js|ts)" --check .
retVal=$?
if [ $retVal -ne 0 ]; then
	echo "Linter Error"
	exit $retVal
fi


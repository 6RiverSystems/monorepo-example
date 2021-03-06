#!/usr/bin/env bash

DO_IT=${1:-false}
PACKAGE_VERSION_DEFAULT=$(npm view @sixriver/standard-api@latest -json | jq -r .version)

# Get the root path of the repo
ROOT=$(git rev-parse --show-toplevel)

# Get the version from package.json
PACKAGE_VERSION=$(jq -r '.dependencies["@sixriver/standard-api"] | select(. != null)' ${ROOT}/packages/*/package.json | head -1)

# If there is no value found, default the version to the latest stable version
if [ -z "${PACKAGE_VERSION}" ] ; then
  PACKAGE_VERSION=${PACKAGE_VERSION_DEFAULT}
fi

# Find the yaml files in packages/oas that are committed to git
YAML_FILES=$(git ls-files --full-name "${ROOT}/packages/oas/*.yaml" "${ROOT}/packages/oas/**/*.yaml")

# Do an in place replacement of the version
for FILE in ${YAML_FILES} ; do
  # If the yaml file imports from standard api, update the version
  if grep -q "https://frontend-apps.6river.org/api/v" "${ROOT}/${FILE}" ; then
    if [[ ${DO_IT} = true ]] ; then
      sed -i.bak -e "s#\(https://frontend-apps.6river.org/api/v\)[^/]*/#https://frontend-apps.6river.org/api/v${PACKAGE_VERSION}/#g" "${ROOT}/${FILE}"
      rm "${ROOT}/${FILE}.bak"
    else
      diff -u "${ROOT}/${FILE}" <( sed -e "s#\(https://frontend-apps.6river.org/api/v\)[^/]*/#https://frontend-apps.6river.org/api/v${PACKAGE_VERSION}/#g" "${ROOT}/${FILE}" )
    fi
  fi
done

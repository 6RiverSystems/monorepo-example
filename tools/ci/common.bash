# Log a message to stderr
# $@: arguments for echo
log() {
	>&2 echo "$@"
}

assert_jq_installed() {
	if ! command -v jq &> /dev/null; then
    echo 'error: jq must be installed'
    return 1
  fi
}

assert_ci_scripts_checked_out() {
	if ! [ -d ci_scripts ]; then
		echo 'error: ci_scripts must be checked out'
		return 1
	fi
}

# Assumes PROJECT_ROOT is set in environment
get_version() {
	local version_file_path="$PROJECT_ROOT"/.version
	if [ -f "$version_file_path" ]; then
		cat "$version_file_path"
	elif [ -n "${VERSION:-}" ]; then
		echo "${VERSION:-}"
	else
		return 1
	fi
}

# $1: version
# $2: path to package.json (defaults to "package.json")
set_version() {
	local version
	version="${1:-}"
	if [ -z "$version" ]; then
		echo 'error: version was not provided to set_version'
	fi

	local package_json_path
	package_json_path="${2:-package.json}"
	if ! [ -f "$package_json_path" ]; then
		echo "error: could not find '$package_json_path'"
	fi

	local tmp
	tmp="$(mktemp)"
	jq --arg version "$version" '.version = $version' "$package_json_path" > "$tmp"
	mv "$tmp" "$package_json_path"
}

import '../../../tools/test-utils/test-global-setup';

const requireContext = (require as any).context('./', true, /\.spec\.tsx?$/);
requireContext.keys().map(requireContext);

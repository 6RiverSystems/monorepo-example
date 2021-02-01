import '../../tools/test-utils/test-global-setup';

const requireContext = (require as any).context('./', true, /\.spec\.ts$/);
requireContext.keys().map(requireContext);

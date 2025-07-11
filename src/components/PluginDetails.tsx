function PluginDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plugin, setPlugin] = useState<Plugin | null>(null);
  const [activeTab, setActiveTab] = useState('description');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [purchasing, setPurchasing] = useState(false);
}
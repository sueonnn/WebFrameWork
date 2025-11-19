import { useNavigate } from 'react-router-dom';
import { NoGroupState } from '../components/specific/main/NoGroupState';
import { FeatureIntro } from '../components/specific/main/FeatureIntro';

export default function MainPage() {
    const navigate = useNavigate();

    const handleCreateGroup = () => {
        navigate('/groups/new');
    };

    const handleJoinGroup = () => {
        navigate('/groups/new?tab=join'); 
    };

    return (
        <section className="grid place-items-start py-12">
            <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-4">
                <NoGroupState
                    onCreateGroup={handleCreateGroup}
                    onJoinGroup={handleJoinGroup}
                />
                <FeatureIntro />
            </div>
        </section>
    );
}
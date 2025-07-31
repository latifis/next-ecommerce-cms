import SkeletonSelect from "./master/selectSkeleton";

const FormUserSkeleton = () => {
    return (
        <div className="space-y-4">
            <SkeletonSelect />
            <SkeletonSelect />
        </div>
    );
};

export default FormUserSkeleton;
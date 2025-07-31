import SkeletonInput from "./master/inputSkeleton";

const FormCategorySkeleton = () => {
    return (
        <div className="space-y-4">
            <SkeletonInput type="input" />
            <SkeletonInput type="textarea" />
        </div>
    );
};

export default FormCategorySkeleton;
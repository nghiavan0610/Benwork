const { ApiError } = require('../../helpers/ErrorHandler');
const {
    User,
    Language,
    UserLanguage,
    Skill,
    UserSkill,
    University,
    Major,
    Country,
    AcademicTitle,
    UserEducation,
    UserCertification,
} = require('../../db/models');
const cloudinary = require('cloudinary').v2;

class ProfileService {
    // [PUT] /api/v1/profile/upload-avatar
    async uploadAvatar(authUser, avatarUrl) {
        try {
            if (authUser.avatarUrl) {
                const decodedUrl = decodeURI(authUser.avatarUrl);
                const imageFileName = decodedUrl.split('/').slice(-3).join('/').replace('.jpg', '');

                await cloudinary.uploader.destroy(imageFileName);
            }

            authUser.avatarUrl = avatarUrl;
            authUser.save();

            return authUser.avatarUrl;
        } catch (err) {
            throw err;
        }
    }

    // [DELETE] /api/v1/profile/deactivate
    async deactivateAccount(id, formData) {
        try {
            const { confirmPassword } = formData;
            const user = await User.findByPk(id, { attributes: ['id', 'password'] });

            if (user && user.comparePassword(confirmPassword)) {
                await user.destroy({});

                await redisClient.del(`accessToken:${user.id}`);
                await redisClient.del(`refreshToken:${user.id}`);
            } else {
                throw new ApiError(403, 'Wrong password');
            }
        } catch (err) {
            throw err;
        }
    }

    // [POST] /api/v1/profile/languages/selective-update
    async updateProfileLanguage(id, formData) {
        try {
            const { userLanguageId, languageId, level, method } = formData;
            const language = await Language.findByPk(languageId, { attributes: ['id'] });
            if (!language) throw new ApiError(404, `Language '${languageId}' was not found`);

            let checkUserLanguage;
            if (method !== 'create') {
                checkUserLanguage = await UserLanguage.findByPk(userLanguageId);
                if (!checkUserLanguage) throw new ApiError(404, 'You do not have this language to update');
                if (checkUserLanguage.userId !== id)
                    throw new ApiError(401, 'You do not have permission to update this language');
            }

            switch (method) {
                case 'create':
                    await UserLanguage.create({ userId: id, languageId, level });
                    break;
                case 'update':
                    await checkUserLanguage.update({ languageId, level });
                    break;
                case 'delete':
                    await checkUserLanguage.destroy({ force: true });
                    break;
                default:
                    throw new ApiError(405, `Invalid method '${method}'`);
            }
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new ApiError(403, 'You already have this language');
            }
            throw err;
        }
    }

    // [POST] /api/v1/profile/skills/selective-update
    async updateProfileSkill(id, formData) {
        try {
            const { userSkillId, skillId, level, method } = formData;
            const skill = await Skill.findByPk(skillId, { attributes: ['id'] });
            if (!skill) throw new ApiError(404, `Skill '${skillId}' was not found`);

            let checkUserSkill;
            if (method !== 'create') {
                checkUserSkill = await UserSkill.findByPk(userSkillId);
                if (!checkUserSkill) throw new ApiError(404, 'You do not have this skill to update');
                if (checkUserSkill.userId !== id)
                    throw new ApiError(401, 'You do not have permission to update this skill');
            }

            switch (method) {
                case 'create':
                    await UserSkill.create({ userId: id, skillId, level });
                    break;
                case 'update':
                    await checkUserSkill.update({ skillId, level });
                    break;
                case 'delete':
                    await checkUserSkill.destroy({ force: true });
                    break;
                default:
                    throw new ApiError(405, `Invalid method '${method}'`);
            }
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new ApiError(403, 'You already have this skill');
            }
            throw err;
        }
    }

    // [POST] /api/v1/profile/education/selective-update
    async updateProfileEducation(id, formData) {
        try {
            const { userEducationId, universityId, majorId, countryId, titleId, yearOfGraduation, method } = formData;

            const [university, major, country, title] = await Promise.all([
                University.findByPk(universityId, { attributes: ['id'] }),
                Major.findByPk(majorId, { attributes: ['id'] }),
                Country.findByPk(countryId, { attributes: ['id'] }),
                AcademicTitle.findByPk(titleId, { attributes: ['id'] }),
            ]);

            if (!university) throw new ApiError(404, `University '${universityId}' was not found`);
            if (!major) throw new ApiError(404, `Major '${majorId}' was not found`);
            if (!country) throw new ApiError(404, `Country '${countryId}' was not found`);
            if (!title) throw new ApiError(404, `Title '${titleId}' was not found`);

            let checkUserEducation;
            if (method !== 'create') {
                checkUserEducation = await UserEducation.findByPk(userEducationId);
                if (!checkUserEducation) throw new ApiError(404, 'You do not have this education to update');
                if (checkUserEducation.userId !== id)
                    throw new ApiError(401, 'You do not have permission to update this education');
            }

            switch (method) {
                case 'create':
                    await UserEducation.create({
                        userId: id,
                        universityId,
                        majorId,
                        countryId,
                        titleId,
                        yearOfGraduation,
                    });
                    break;
                case 'update':
                    await checkUserEducation.update({ universityId, majorId, countryId, titleId, yearOfGraduation });
                    break;
                case 'delete':
                    await checkUserEducation.destroy({ force: true });
                    break;
                default:
                    throw new ApiError(405, `Invalid method '${method}'`);
            }
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new ApiError(403, 'You already have this education');
            }
            throw err;
        }
    }

    // [POST] /api/v1/profile/certification/selective-update
    async updateProfileCertification(id, formData) {
        try {
            const { userCertificationId, name, certificatedFrom, yearOfCertification, method } = formData;

            let checkUserCertification;
            if (method !== 'create') {
                checkUserCertification = await UserCertification.findByPk(userCertificationId);
                if (!checkUserCertification) throw new ApiError(404, 'You do not have this certification to update');
                if (checkUserCertification.userId !== id)
                    throw new ApiError(401, 'You do not have permission to update this certification');
            }

            switch (method) {
                case 'create':
                    await UserCertification.create({ userId: id, name, certificatedFrom, yearOfCertification });
                    break;
                case 'update':
                    await checkUserCertification.update({ name, certificatedFrom, yearOfCertification });
                    break;
                case 'delete':
                    await checkUserCertification.destroy({ force: true });
                    break;
                default:
                    throw new ApiError(405, `Invalid method '${method}'`);
            }
        } catch (err) {
            if (err.name === 'SequelizeUniqueConstraintError') {
                throw new ApiError(403, 'You already have this certification');
            }
            throw err;
        }
    }
}

module.exports = new ProfileService();

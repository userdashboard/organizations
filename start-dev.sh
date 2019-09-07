NODE_ENV=development \
PAGE_SIZE=3 \
PORT=8003 \
DASHBOARD_SERVER="http://localhost:8003" \
STORAGE_PATH=/tmp/organizations \
node main.js --debug-brk=5858

# Organizations module startup parameters
# These ENV variables let you tweak certain parts of the Organizations module to your preference.

# MINIMUM_ORGANIZATION_NAME_LENGTH=1 
# number default 1
# minumum length for organization names

# MAXIMUM_ORGANIZATION_NAME_LENGTH=50 
# number default 100
# maximum length for organization names

# MINIMUM_INVITATION_CODE_LENGTH=1 
# number default 10
# minumum length for organization invite codes

# MAXIMUM_INVITATION_CODE_LENGTH=50 
# number default 10
# minumum length for organization invite codes

# MEMBERSHIP_PROFILE_FIELDS=display-name,display-email
# list of profile properties default display-name,display-email
# required fields for membership profiles
